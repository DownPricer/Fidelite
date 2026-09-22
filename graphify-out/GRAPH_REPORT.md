# Graph Report - Cartefidelité  (2026-09-22)

## Corpus Check
- 521 files · ~4,693,093 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 2723 nodes · 8522 edges · 132 communities (114 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e9daff1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- jsonError
- playwright
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- Button
- rbac.ts
- firstActiveStaffMembership
- wallet-event-dedup.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- requireMutatingRequest
- interactive-loyalty-card.tsx
- card-editor-properties.tsx
- validation.ts
- vitest
- http.ts
- wallet-home.tsx
- merchant-ui.tsx
- use-wallet-unlock-animation.ts
- super-admin.test.ts
- caisse-scan.ts
- loyalty-commit.ts
- merchant-app-access.ts
- google-auth.ts
- env.ts
- requireMerchantAdmin
- profile-page.tsx
- loyalty-program.ts
- @prisma/client
- cashier-checkout.tsx
- ProgramConfigurator
- resolvePublishedMerchantCardTemplate
- CardEditorPage
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- jsonOk
- demo-session.ts
- What You Must Do When Invoked
- loyalty-service.ts
- media-storage.ts
- loyalty-commit.test.ts
- global-card.tsx
- ref_fs_promises
- ref_next_navigation
- src/app/page.tsx
- compilerOptions
- customer-loyalty-overview.ts
- loyalty-program-publication.ts
- qr-cache.ts
- qa-login.ts
- caisse-client-number.test.ts
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- caisse-scan.test.ts
- card-deck.tsx
- ref_next_link
- loyalty-service.test.ts
- scripts
- [kind]/route.ts
- platform-stats.ts
- google-wallet/route.ts
- programme/ui.tsx
- src/app/layout.tsx
- program/route.ts
- scan-session.ts
- generate-pwa-icons.mjs
- merchants-list.tsx
- merchant-interactive-card.tsx
- card-template-schema.ts
- confirm/route.ts
- loyaltyBalanceForMode
- qa-login/page.tsx
- EmployeeDetailPanel
- cards-index.tsx
- caisse-scan-route.test.ts
- resolveLandingAuthTargets
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- MerchantDetailPage
- fife-life/merchant-detail.tsx
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- super-admin-session.ts
- progress-ring.tsx
- semi-gauge.tsx
- react
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- ref_next_server
- ref_path
- qr-input.ts
- card-editor.tsx
- landing-header.tsx
- graphify reference: query, path, explain
- verify-viewports.mjs
- employee-invitation-service.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- getEmployeeSession
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- cn
- ref_node_path
- employe/connexion/ui.tsx
- employee-access.test.ts
- landing-faq.tsx
- app-nav.tsx
- install-pwa.tsx
- use-media-query.ts
- rewardFromDb
- media-storage-guard.ts
- theme-provider.tsx
- demo-visual.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 148 edges
2. `jsonOk()` - 130 edges
3. `requireMutatingRequest()` - 91 edges
4. `react` - 87 edges
5. `prisma` - 85 edges
6. `@prisma/client` - 82 edges
7. `vitest` - 74 edges
8. `clientIp()` - 74 edges
9. `userAgent()` - 70 edges
10. `writeAudit()` - 62 edges

## Surprising Connections (you probably didn't know these)
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts
- `main()` --calls--> `signQrToken()`  [EXTRACTED]
  prisma/seed.ts → src/lib/qr.ts
- `parseTtlMinutes()` --calls--> `parseQaLoginTtlMinutes()`  [EXTRACTED]
  scripts/create-qa-login-link.ts → src/lib/qa-login.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (132 total, 18 thin omitted)

### Community 0 - "jsonError"
Cohesion: 0.09
Nodes (38): GET(), PATCH(), GET(), POST(), GET(), DELETE(), dynamic, GET() (+30 more)

### Community 1 - "playwright"
Cohesion: 0.07
Nodes (17): ref_node_fs_promises, playwright, OUT, OUT, shots, goto(), OUT, tiers (+9 more)

### Community 2 - "scan/ui.tsx"
Cohesion: 0.14
Nodes (20): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+12 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (54): LegacyCardEditorRedirect(), CardEditorVariantRoute(), convertConfigForTargetSlot(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+46 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "Button"
Cohesion: 0.14
Nodes (16): Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), ChangePasswordPage(), SuperAdminLoginPage(), AuthSeparator(), GoogleAuthButton() (+8 more)

### Community 6 - "rbac.ts"
Cohesion: 0.09
Nodes (21): assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), MAX_ACTIVE_EMPLOYEES, staffHasPermission(), ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS (+13 more)

### Community 7 - "firstActiveStaffMembership"
Cohesion: 0.22
Nodes (18): CustomerDetailPage(), ClientsPage(), CustomerDetailPanel(), EmployeeDetailPage(), EmployeesPage(), MerchantHomePage(), AdvantagesPage(), SettingsPage() (+10 more)

### Community 8 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.10
Nodes (22): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+14 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (49): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad() (+41 more)

### Community 11 - "requireMutatingRequest"
Cohesion: 0.18
Nodes (33): POST(), POST(), POST(), POST(), schema, POST(), POST(), POST() (+25 more)

### Community 12 - "interactive-loyalty-card.tsx"
Cohesion: 0.15
Nodes (16): InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground(), getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey (+8 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (64): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+56 more)

### Community 14 - "validation.ts"
Cohesion: 0.07
Nodes (40): POST(), POST(), POST(), FILTER_MAP, GET(), GET(), POST(), POST() (+32 more)

### Community 15 - "vitest"
Cohesion: 0.15
Nodes (29): vitest, buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), ActiveMerchantLoyaltyContext, isMerchantOperational(), isProgramOperational() (+21 more)

### Community 16 - "http.ts"
Cohesion: 0.11
Nodes (32): POST(), schema, logScanBody(), POST(), scanVia(), POST(), POST(), dynamic (+24 more)

### Community 17 - "wallet-home.tsx"
Cohesion: 0.14
Nodes (17): ref_motion_react, react-dom, AddToGoogleWalletButton(), CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCodeProps (+9 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.15
Nodes (18): Customer, CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel(), formatActivity() (+10 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.16
Nodes (20): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), sseChunk(), WalletEventPayload, isDocumentVisible(), UnlockRevealPhase (+12 more)

### Community 20 - "super-admin.test.ts"
Cohesion: 0.27
Nodes (12): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+4 more)

### Community 21 - "caisse-scan.ts"
Cohesion: 0.25
Nodes (10): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), CAISSE_GRANT_TTL_MS, logWalletUnlock() (+2 more)

### Community 22 - "loyalty-commit.ts"
Cohesion: 0.10
Nodes (39): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), evaluateCustomerRewards(), isMerchantActive(), isProgramActive() (+31 more)

### Community 23 - "merchant-app-access.ts"
Cohesion: 0.16
Nodes (15): CaissePage(), DashboardLayout(), DashboardLayout(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), hasMerchantStaffAccess(), isMerchantAppPublicPath() (+7 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.10
Nodes (24): assertSameOrigin(), CsrfError, env, getAllowedOrigins(), isProduction(), hostnameOf(), isAdminHost(), isAppHost() (+16 more)

### Community 26 - "requireMerchantAdmin"
Cohesion: 0.20
Nodes (18): GET(), GET(), GET(), DELETE(), GET(), mapEmployee(), PATCH(), employeeLoginUrl() (+10 more)

### Community 27 - "profile-page.tsx"
Cohesion: 0.08
Nodes (35): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+27 more)

### Community 28 - "loyalty-program.ts"
Cohesion: 0.12
Nodes (28): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes(), minutesBetween(), primaryEarnLabel() (+20 more)

### Community 29 - "@prisma/client"
Cohesion: 0.08
Nodes (46): @prisma/client, LinearGauge(), MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode (+38 more)

### Community 30 - "cashier-checkout.tsx"
Cohesion: 0.18
Nodes (17): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+9 more)

### Community 31 - "ProgramConfigurator"
Cohesion: 0.21
Nodes (20): modeTitle(), ProgramConfigurator(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward() (+12 more)

### Community 32 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.23
Nodes (11): GET(), LOYALTY_MODES, JoinMerchantPage(), getPublishedCardTemplate(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep, adaptTemplateConfigForGeneralSlot() (+3 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.15
Nodes (22): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+14 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.07
Nodes (37): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+29 more)

### Community 37 - "jsonOk"
Cohesion: 0.13
Nodes (21): zod, POST(), GET(), GET(), GET(), GET(), GET(), GET() (+13 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.13
Nodes (20): GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, demoCookieNamesForRole(), demoEnterTarget() (+12 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "loyalty-service.ts"
Cohesion: 0.25
Nodes (14): updateWalletBalance(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), earnGainLabel(), formatSignedUnitDelta(), historyEntryLabel() (+6 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (26): GET(), MIME, appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+18 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "global-card.tsx"
Cohesion: 0.22
Nodes (12): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), LADDER, resolveTier(), TIER_STYLE, CardHistoryItem (+4 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.15
Nodes (8): ref_fs_promises, ref_sharp, OUT, shots, OUT, tiers, files, INPUT_DIR

### Community 45 - "ref_next_navigation"
Cohesion: 0.16
Nodes (16): ref_next_headers, ref_next_navigation, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+8 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (25): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "customer-loyalty-overview.ts"
Cohesion: 0.14
Nodes (20): WalletHome(), activityFromWalletEvent(), buildCardNextRewardEntry(), buildFifeLifeNextReward(), buildHistoricalRewardOverview(), buildNextRewardCandidates(), CardNextRewardEntry, CardRewardProgress (+12 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (22): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+14 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.20
Nodes (14): QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr(), inflight (+6 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (41): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), GET(), parseUserAgent(), assertQaLoginTtlMinutes() (+33 more)

### Community 52 - "caisse-client-number.test.ts"
Cohesion: 0.29
Nodes (9): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique, userFindFirst (+1 more)

### Community 53 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+9 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.06
Nodes (72): main(), prisma, requiredEnv(), upsertEmployee(), google-auth-library, jose, qrcode, accessToken() (+64 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (12): nodemailer, buildInvitationContent(), emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry(), isEmailConfigured() (+4 more)

### Community 56 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+7 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (56): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+48 more)

### Community 58 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 59 - "card-deck.tsx"
Cohesion: 0.18
Nodes (14): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+6 more)

### Community 60 - "ref_next_link"
Cohesion: 0.09
Nodes (11): ref_next_link, SPACES, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel() (+3 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+5 more)

### Community 63 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (6): ref_os, GET(), notFound(), config(), loadRoute(), PNG_BYTES

### Community 64 - "platform-stats.ts"
Cohesion: 0.30
Nodes (11): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), PeriodKey (+3 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.18
Nodes (21): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+13 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.12
Nodes (20): DEMO_CONFIG, HistoricalEntitlement, MODES, PROGRAM_STEP_TARGETS, PROGRAM_STEPS, publishedEarnDescription(), emptyReward(), FieldErrors (+12 more)

### Community 67 - "src/app/layout.tsx"
Cohesion: 0.22
Nodes (7): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister()

### Community 68 - "program/route.ts"
Cohesion: 0.21
Nodes (13): GET(), sortOrder(), GET(), loadProgram(), POST(), PUT(), balanceFieldForUnit(), decideRewardRemoval() (+5 more)

### Community 69 - "scan-session.ts"
Cohesion: 0.29
Nodes (11): CAISSE_SCAN_PATH, CaisseScanRequest, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), INSTANT_DUPLICATE_MS, postCaisseScan(), safeStopScanner(), SCANNER_STATE (+3 more)

### Community 70 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "merchant-interactive-card.tsx"
Cohesion: 0.20
Nodes (8): ExpandableQrCode(), handleActivate(), openQr(), InteractiveCardShell(), InteractiveCardShellProps, MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR

### Community 73 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (30): CardTemplateBackground(), LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), buildCardBackgroundImageStyle() (+22 more)

### Community 74 - "confirm/route.ts"
Cohesion: 0.14
Nodes (18): POST(), schema, POST(), GET(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl() (+10 more)

### Community 75 - "loyaltyBalanceForMode"
Cohesion: 0.13
Nodes (26): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, getCustomerLoyaltyOverview() (+18 more)

### Community 76 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 79 - "caisse-scan-route.test.ts"
Cohesion: 0.29
Nodes (5): processCaisseScan, processCaisseScanByClientNumber, requireCaisse, requireMutatingRequest, writeAudit

### Community 80 - "resolveLandingAuthTargets"
Cohesion: 0.19
Nodes (6): HomePage(), BARS, LandingMerchantPreview(), STATS, resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 85 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 86 - "fife-life/merchant-detail.tsx"
Cohesion: 0.15
Nodes (20): CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel(), notifyMerchantRewardProgressRefresh(), TargetBlock(), ActivityItem (+12 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.09
Nodes (26): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCardsPage(), MerchantCardsPage() (+18 more)

### Community 93 - "react"
Cohesion: 0.11
Nodes (16): react, recharts, EmployeeInvitationScreen(), LOYALTY_MODES, STEPS, ACTIVITY_LABELS, Overview, QUICK_LINKS (+8 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_next_server"
Cohesion: 0.13
Nodes (9): ref_next_server, findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM (+1 more)

### Community 102 - "ref_path"
Cohesion: 0.15
Nodes (11): ref_fs, ref_path, ref_vitest_config, main(), outDir, shot(), outDir, main() (+3 more)

### Community 103 - "qr-input.ts"
Cohesion: 0.43
Nodes (5): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken()

### Community 104 - "card-editor.tsx"
Cohesion: 0.15
Nodes (8): PreviewScenario, PROGRESS_STEPS, SCENARIO_LABELS, CardEditorBackgroundCrop(), Action, HistoryState, useEditorHistory(), CARD_SLOT_TITLES

### Community 105 - "landing-header.tsx"
Cohesion: 0.33
Nodes (5): MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 108 - "employee-invitation-service.ts"
Cohesion: 0.20
Nodes (17): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), acceptInvitationWithPassword() (+9 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "getEmployeeSession"
Cohesion: 0.40
Nodes (4): EmployeeLoginPage(), ProEntryPage(), getEmployeeSession(), LandingAuthTargets

### Community 118 - "employee-session.ts"
Cohesion: 0.21
Nodes (13): cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession, employeeTokenFromRequest() (+5 more)

### Community 120 - "cn"
Cohesion: 0.19
Nodes (9): CreateMerchantWizard(), goNext(), stepError(), PrismCard(), PrismCardProps, items, WalletNav(), PasswordInput() (+1 more)

### Community 121 - "ref_node_path"
Cohesion: 0.07
Nodes (21): ref_node_fs, ref_node_path, outDir, outDir, outDir, generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest (+13 more)

### Community 122 - "employe/connexion/ui.tsx"
Cohesion: 0.47
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "employee-access.test.ts"
Cohesion: 0.53
Nodes (4): assertEarnProgramRules(), employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie()

### Community 124 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 125 - "app-nav.tsx"
Cohesion: 0.67
Nodes (3): AppNav(), icons, isActive()

### Community 128 - "rewardFromDb"
Cohesion: 0.50
Nodes (4): normalizeThresholdUnit(), parseRewardConditionsField(), rewardFromDb(), rewardsForProgramMode()

### Community 129 - "media-storage-guard.ts"
Cohesion: 0.83
Nodes (3): deleteCardBackground(), deleteCardBackgroundIfUnused(), isCardBackgroundInUse()

### Community 137 - "theme-provider.tsx"
Cohesion: 0.25
Nodes (4): next-themes, ref_react_dom_client, THEME_COLOR, ThemeProvider()

### Community 138 - "demo-visual.ts"
Cohesion: 0.11
Nodes (27): ref_react_dom_server, CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PREFERENCES (+19 more)

## Knowledge Gaps
- **629 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+624 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 850 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `jsonError`, `merchant-card-template-service.ts`, `rbac.ts`, `loyalty-widget.ts`, `requireMutatingRequest`, `card-editor-properties.tsx`, `vitest`, `wallet-home.tsx`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `loyalty-commit.ts`, `merchant-app-access.ts`, `google-auth.ts`, `env.ts`, `requireMerchantAdmin`, `profile-page.tsx`, `loyalty-program.ts`, `cashier-checkout.tsx`, `resolvePublishedMerchantCardTemplate`, `CardEditorPage`, `package.json`, `loyalty-service.ts`, `customer-loyalty-overview.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `program/route.ts`, `confirm/route.ts`, `loyaltyBalanceForMode`, `cards-index.tsx`, `create-super-admin.ts`, `fife-life/merchant-detail.tsx`, `super-admin-session.ts`, `card-editor.tsx`, `employee-invitation-service.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `scan/ui.tsx`, `merchant-card-template-service.ts`, `Button`, `wallet-event-dedup.ts`, `theme-provider.tsx`, `loyalty-widget-view.tsx`, `demo-visual.ts`, `interactive-loyalty-card.tsx`, `card-editor-properties.tsx`, `wallet-home.tsx`, `merchant-ui.tsx`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `@prisma/client`, `cashier-checkout.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `global-card.tsx`, `qr-cache.ts`, `card-deck.tsx`, `ref_next_link`, `programme/ui.tsx`, `src/app/layout.tsx`, `merchants-list.tsx`, `merchant-interactive-card.tsx`, `card-template-schema.ts`, `qa-login/page.tsx`, `cards-index.tsx`, `fife-life/merchant-detail.tsx`, `card-editor.tsx`, `landing-header.tsx`, `cn`, `employe/connexion/ui.tsx`, `landing-faq.tsx`, `install-pwa.tsx`, `use-media-query.ts`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `merchant-card-template-service.ts`, `Button`, `rbac.ts`, `theme-provider.tsx`, `loyalty-widget.ts`, `demo-visual.ts`, `card-editor-properties.tsx`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `loyalty-commit.ts`, `google-auth.ts`, `env.ts`, `loyalty-program.ts`, `@prisma/client`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `demo-session.ts`, `loyalty-service.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `customer-loyalty-overview.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `caisse-client-number.test.ts`, `google-wallet.ts`, `email.ts`, `insight-stats.ts`, `caisse-scan.test.ts`, `card-deck.tsx`, `loyalty-service.test.ts`, `[kind]/route.ts`, `platform-stats.ts`, `program/route.ts`, `scan-session.ts`, `merchant-interactive-card.tsx`, `card-template-schema.ts`, `confirm/route.ts`, `loyaltyBalanceForMode`, `caisse-scan-route.test.ts`, `resolveLandingAuthTargets`, `fife-life/merchant-detail.tsx`, `ref_next_server`, `ref_path`, `qr-input.ts`, `employee-invitation-service.ts`, `ref_node_path`, `employee-access.test.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _629 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `jsonError` be split into smaller, more focused modules?**
  _Cohesion score 0.09480519480519481 - nodes in this community are weakly interconnected._
- **Should `playwright` be split into smaller, more focused modules?**
  _Cohesion score 0.06606606606606606 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._