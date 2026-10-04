# Graph Report - Cartefidelité  (2026-10-04)

## Corpus Check
- 744 files · ~4,841,996 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4115 nodes · 12936 edges · 194 communities (163 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `add13050`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- loyalty-context.ts
- next
- merchant-card-template-service.ts
- click/route.ts
- react
- loyalty-commit.ts
- merchant-billing.ts
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- prisma.ts
- customer-reward-progress.ts
- audit.ts
- google-wallet.ts
- [id]/merchant-detail.tsx
- ad-visual-workflow.ts
- clients/ui.tsx
- jsonError
- merchant-card-finish.test.ts
- buildGoogleWalletMerchantView
- google-auth.ts
- hosts.ts
- jsonOk
- solde/ui.tsx
- ad-visual-parts.tsx
- zod
- demo-visual.ts
- employees/[id]/route.ts
- types.ts
- CardEditorPage
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- stripe-webhook-marketing.test.ts
- media-storage.ts
- loyalty-commit.test.ts
- insight-period.ts
- loyalty-service.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- @prisma/client
- wallet-home.tsx
- qa-login.ts
- ref_node_path
- dependencies
- stripe.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- sponsored-test-broadcast.ts
- card-enlarged-view.tsx
- insight-permissions.test.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- employee-demo-server.ts
- card-deck.tsx
- vitest
- resolvePublishedMerchantCardTemplate
- stripe-webhook-route.test.ts
- sponsored-placements.test.ts
- campaign-en-cours.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- advantages-ui.tsx
- qr-cache.ts
- unsubscribe/route.ts
- profile-page.tsx
- requireMerchantAdmin
- app/app/connexion/page.tsx
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- loyalty-card-view-model.ts
- campaign-quota.ts
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- getSessionUser
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- money.ts
- campaign-test-mode-isolation.test.ts
- src/app/layout.tsx
- preview-data.ts
- ad-visual-crop-specs.ts
- graphify reference: query, path, explain
- campaign-worker.test.ts
- cn
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- tarifs/page.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- env.ts
- ad-confirm-route.test.ts
- use-wallet-unlock-animation.ts
- campaign-confirm-route.test.ts
- qr.ts
- employee-session.ts
- cashier-checkout.tsx
- sponsored-hours-pricing.ts
- profile-shared.tsx
- caisse/ui.tsx
- MerchantDetailPage
- app/ui.tsx
- employee-invitation-service.ts
- super-admin-campaign-moderation.test.ts
- staff-notification-delivery.ts
- layout-client.tsx
- card-editor.tsx
- landing-page.test.ts
- webhook/route.ts
- push-client.ts
- notifications-center.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- marketing-topup-route.test.ts
- customer-qr.ts
- stripe-mode.test.ts
- lib/campaign-worker.ts
- loyalty-service.test.ts
- dashboard/route.ts
- merchant-billing.test.ts
- scripts/campaign-worker.ts
- customer-loyalty-overview.ts
- SettingsPage
- customer-qr-route.test.ts
- sponsored-slot.tsx
- session.ts
- merchant-ad-edit.test.ts
- televerser/route.ts
- campaign-quota.test.ts
- campaign-audience.test.ts
- ad-detail.tsx
- customer-notifications-route.test.ts
- caisse-scan.test.ts
- campaign-lifecycle.ts
- customer-preferences-route.test.ts
- marketing-balance.test.ts
- sponsored-selection.ts
- api-merchant-statistics-route.test.ts
- ad-google-wallet-visual-workflow.ts
- landing-faq.tsx
- super-admin-ad-moderation.test.ts
- customer-push-route.test.ts
- CreateMerchantWizard
- card-template-schema.ts
- landing-header.tsx
- landing-footer.tsx
- avatar-storage.ts
- super-admin-ad-detail-page.test.ts
- employe/layout.tsx
- use-media-query.ts
- landing-merchant-preview.tsx
- carte/avantages/page.tsx
- super-admin/layout.tsx
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 269 edges
2. `jsonOk()` - 235 edges
3. `requireMutatingRequest()` - 171 edges
4. `next` - 161 edges
5. `prisma` - 152 edges
6. `vitest` - 130 edges
7. `clientIp()` - 123 edges
8. `readJson()` - 122 edges
9. `react` - 116 edges
10. `userAgent()` - 112 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `click()` --calls--> `GET()`  [EXTRACTED]
  tests/sponsored-placements.test.ts → src/app/api/customer/sponsored/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (194 total, 31 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.11
Nodes (26): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber() (+18 more)

### Community 1 - "loyalty-context.ts"
Cohesion: 0.11
Nodes (33): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot (+25 more)

### Community 2 - "next"
Cohesion: 0.07
Nodes (49): nextConfig, next, CaissePage(), CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage() (+41 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (59): PATCH(), POST(), cardTemplateConfigSchema, ALL_MERCHANT_CARD_SLOTS, isLoyaltyProgramSlot(), loyaltyModeForCardSlot(), adaptTemplateConfigForCardSlot(), adaptTemplateConfigForGeneralSlot() (+51 more)

### Community 4 - "click/route.ts"
Cohesion: 0.16
Nodes (14): GET(), computeAdLifecycleStatus(), isSafeAdUrl(), AdForWorkflow, buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized() (+6 more)

### Community 5 - "react"
Cohesion: 0.05
Nodes (40): react, SettingsPanel(), Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), metadata (+32 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (49): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+41 more)

### Community 7 - "merchant-billing.ts"
Cohesion: 0.16
Nodes (22): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+14 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.17
Nodes (21): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+13 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.07
Nodes (37): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyGaugeThumbnail(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView() (+29 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (44): buildElementCatalog(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+36 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (39): POST(), schema, deleteSchema, markCustomerProfileFinalized(), acceptInvitationSchema, adjustmentSchema, adModerationSchema, avatarUploadSchema (+31 more)

### Community 12 - "VisualPicker"
Cohesion: 0.31
Nodes (11): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onFidetoFilesSelected(), onSelfFileSelected() (+3 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (65): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, elementLabel(), GuideLine (+57 more)

### Community 14 - "prisma.ts"
Cohesion: 0.07
Nodes (39): FILTER_MAP, dynamic, GET(), GET(), sortOrder(), GET(), PERIOD_KEYS, GET() (+31 more)

### Community 15 - "customer-reward-progress.ts"
Cohesion: 0.11
Nodes (26): MerchantRewardProgressPanel(), TargetBlock(), PREVIEW_CARDS, resetQrCache(), buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress (+18 more)

### Community 16 - "audit.ts"
Cohesion: 0.13
Nodes (22): POST(), schema, schema, POST(), POST(), POST(), POST(), schema (+14 more)

### Community 17 - "google-wallet.ts"
Cohesion: 0.13
Nodes (38): isGoogleWalletConfigured(), accessToken(), GoogleWalletAppearance, assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl() (+30 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.11
Nodes (29): EDITABLE_STATUSES, GET(), GET(), POST(), POST(), schema, PROPOSABLE, schema (+21 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "jsonError"
Cohesion: 0.06
Nodes (49): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), DELETE() (+41 more)

### Community 22 - "merchant-card-finish.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 23 - "buildGoogleWalletMerchantView"
Cohesion: 0.17
Nodes (24): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), appLinkData(), availableRewardModules() (+16 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.10
Nodes (30): GET(), GET(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), JoinMerchantPage(), isGoogleAuthConfigured(), consumeGoogleCallback() (+22 more)

### Community 25 - "hosts.ts"
Cohesion: 0.12
Nodes (31): isProduction(), appOriginForPublicLinks(), assertSafeEmailLink(), canonicalOrigin(), employeeInvitationUrl(), employeeOriginForPublicLinks(), FORBIDDEN_PUBLIC_HOSTS, hostMatches() (+23 more)

### Community 26 - "jsonOk"
Cohesion: 0.11
Nodes (77): POST(), POST(), POST(), POST(), POST(), POST(), POST(), GET() (+69 more)

### Community 27 - "solde/ui.tsx"
Cohesion: 0.12
Nodes (17): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), audienceDisplay(), BalanceData, CampaignWizard() (+9 more)

### Community 28 - "ad-visual-parts.tsx"
Cohesion: 0.08
Nodes (40): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+32 more)

### Community 29 - "zod"
Cohesion: 0.10
Nodes (23): zod, dynamic, logCustomerQr(), POST(), runtime, schema, GET(), previewResponse() (+15 more)

### Community 30 - "demo-visual.ts"
Cohesion: 0.12
Nodes (17): CarteIdentitePage(), PREVIEW_HISTORY, CustomerLoyaltyOverview, DEMO_LOYALTY_OVERVIEW, CLIENT_DEMO_COOKIE, src_lib_demo_visual_client_demo_cookie, DEMO_CLIENT_NUMBER, DEMO_EMAIL (+9 more)

### Community 31 - "employees/[id]/route.ts"
Cohesion: 0.16
Nodes (20): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+12 more)

### Community 32 - "types.ts"
Cohesion: 0.09
Nodes (22): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+14 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.16
Nodes (21): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+13 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.12
Nodes (23): CoverCropEditor(), onHandlePointerDown(), move(), up(), onWheel(), CoverCropEditorSpec, GoogleWalletMediaCrop(), confirm() (+15 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (35): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+27 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.11
Nodes (31): CarteLayout(), CompteLayout(), NotificationsLayout(), authenticateCustomerWithPassword(), enforceCustomerWalletAccess(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl() (+23 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (12): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+4 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.10
Nodes (33): GET(), MIME, GET(), MIME, GET(), notFound(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions() (+25 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "insight-period.ts"
Cohesion: 0.21
Nodes (20): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, InsightRange (+12 more)

### Community 44 - "loyalty-service.ts"
Cohesion: 0.28
Nodes (12): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), earnGainLabel(), LoyaltyError, LoyaltySnapshot, applyLoyaltyAction() (+4 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.11
Nodes (23): GET(), GET(), GET(), GET(), GET(), isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+15 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.11
Nodes (25): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+17 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+12 more)

### Community 49 - "@prisma/client"
Cohesion: 0.09
Nodes (38): @prisma/client, GET(), loadProgram(), POST(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields (+30 more)

### Community 50 - "wallet-home.tsx"
Cohesion: 0.14
Nodes (11): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), PERSONALIZED_QR_KEY, usePersonalizedQr(), WalletCardsList(), WalletHome(), WalletQrAction() (+3 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (39): assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson(), qaNotFound() (+31 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (39): ref_node_buffer, ref_node_fs, ref_node_path, ref_node_url, ref_node_zlib, playwright, outDir, pages (+31 more)

### Community 53 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+12 more)

### Community 54 - "stripe.ts"
Cohesion: 0.15
Nodes (20): BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, createBillingPortalSession(), createCampaignCheckoutSession() (+12 more)

### Community 55 - "email.ts"
Cohesion: 0.18
Nodes (26): nodemailer, ContactPage(), requestAccountRecovery(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (31): bucketKey(), enumerateBucketKeys(), buildCohorts(), buildComparison(), buildFinancial(), buildFrequentation(), buildOverview(), buildRetention() (+23 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): MobilePlacementPreview(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "sponsored-test-broadcast.ts"
Cohesion: 0.13
Nodes (28): DELETE(), GET(), POST(), publicGoogleWalletError(), adToGlobalWalletTestModule(), adToSponsoredTestCard(), BroadcastAd, getSponsoredTestBroadcastAdId() (+20 more)

### Community 60 - "card-enlarged-view.tsx"
Cohesion: 0.14
Nodes (16): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+8 more)

### Community 61 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "employee-demo-server.ts"
Cohesion: 0.28
Nodes (8): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie, isEmployeeDemoCookie(), isEmployeeDevDemo(), resolveEmployeeDemo()

### Community 66 - "card-deck.tsx"
Cohesion: 0.11
Nodes (24): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+16 more)

### Community 67 - "vitest"
Cohesion: 0.07
Nodes (22): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, main() (+14 more)

### Community 68 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.16
Nodes (16): GET(), LOYALTY_MODES, GET(), dynamic, MerchantProfilePage(), getPublishedCardTemplate(), logMerchantCardSwitch(), MerchantCardSwitchContext (+8 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "sponsored-placements.test.ts"
Cohesion: 0.08
Nodes (26): END, fake, h, previewCall(), START, END, fake, START (+18 more)

### Community 71 - "campaign-en-cours.ts"
Cohesion: 0.15
Nodes (13): CampagnesPanel(), statusTone(), AD_EN_COURS, AdEnCoursInput, ANNOUNCE_EN_COURS, CampaignEnCoursInput, isCampaignEnCours(), isSponsoredAdLiveNow() (+5 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.14
Nodes (30): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+22 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (17): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+9 more)

### Community 75 - "qr-cache.ts"
Cohesion: 0.22
Nodes (12): QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr(), inflight (+4 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.17
Nodes (14): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+6 more)

### Community 77 - "profile-page.tsx"
Cohesion: 0.20
Nodes (14): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), SheetAction(), HistoryFilter, ProfilePage() (+6 more)

### Community 78 - "requireMerchantAdmin"
Cohesion: 0.13
Nodes (43): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+35 more)

### Community 79 - "app/app/connexion/page.tsx"
Cohesion: 0.39
Nodes (6): AppLoginPage(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS, MerchantPlan, MerchantPlanId

### Community 80 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (50): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), AD_STATUS_FILTER_OPTIONS (+42 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "loyalty-card-view-model.ts"
Cohesion: 0.17
Nodes (14): DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground(), getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey, WALLET_TIER_TO_CARD_KEY, walletTierToCardKey() (+6 more)

### Community 85 - "campaign-quota.ts"
Cohesion: 0.21
Nodes (12): CAMPAIGN_PRICE_CENTS, consumeQuotaForCampaign(), priceMemberOrNetworkCampaign(), priceSponsoredAd(), PricingResult, quotaKindFor(), INCLUDED_QUOTAS, isNetworkQuotaKind() (+4 more)

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.12
Nodes (17): submit(), resolveSponsoredImageUrl(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile() (+9 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "getSessionUser"
Cohesion: 0.33
Nodes (12): GET(), AccountPage(), ParametresPage(), dynamic, NotificationsPage(), ensureCustomerPreferences(), getProfileUser(), serializePreferences() (+4 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (23): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+15 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "money.ts"
Cohesion: 0.14
Nodes (21): AmountField(), press(), KEYS, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable(), RewardStatus (+13 more)

### Community 102 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 103 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 104 - "preview-data.ts"
Cohesion: 0.19
Nodes (11): PREVIEW_BENEFITS, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY, BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry (+3 more)

### Community 105 - "ad-visual-crop-specs.ts"
Cohesion: 0.31
Nodes (8): sharp, renderAdVisualCrop(), AD_BANNER_CROP_SPEC, AD_GOOGLE_WALLET_HERO_CROP_SPEC, AD_VISUAL_CROP_SPECS, AdVisualCropSpec, AdVisualCropTarget, coverCropExtractRegion()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "cn"
Cohesion: 0.06
Nodes (39): DEMO, Employee, EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend() (+31 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "env.ts"
Cohesion: 0.09
Nodes (15): dynamic, robots(), dynamic, sitemap(), assertEarnProgramRules(), assertSameOrigin(), CsrfError, employeeCookieName() (+7 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "use-wallet-unlock-animation.ts"
Cohesion: 0.17
Nodes (20): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), isDocumentVisible(), useWalletUnlockAnimation(), flushWhenVisible(), cardFromUnlockPayload() (+12 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "qr.ts"
Cohesion: 0.18
Nodes (14): main(), prisma, requiredEnv(), upsertEmployee(), bcryptjs, main(), prisma, required() (+6 more)

### Community 125 - "employee-session.ts"
Cohesion: 0.22
Nodes (14): EmployeeLoginPage(), canEmployeeAccess(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason() (+6 more)

### Community 126 - "cashier-checkout.tsx"
Cohesion: 0.11
Nodes (22): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), CashierScanResult, Phase, RewardCard(), statusClass() (+14 more)

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.13
Nodes (24): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+16 more)

### Community 128 - "profile-shared.tsx"
Cohesion: 0.28
Nodes (11): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+3 more)

### Community 129 - "caisse/ui.tsx"
Cohesion: 0.12
Nodes (33): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanScreen(), statusLabel(), ClientNumberField(), formatCameraError(), QrScanner() (+25 more)

### Community 130 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employee-invitation-service.ts"
Cohesion: 0.22
Nodes (15): buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), acceptInvitationWithPassword(), createMembershipInvitation() (+7 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "staff-notification-delivery.ts"
Cohesion: 0.17
Nodes (17): web-push, isWebPushConfigured(), publicAppUrl(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser() (+9 more)

### Community 135 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 136 - "card-editor.tsx"
Cohesion: 0.08
Nodes (30): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+22 more)

### Community 137 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 138 - "webhook/route.ts"
Cohesion: 0.25
Nodes (13): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+5 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "notifications-center.tsx"
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.20
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.14
Nodes (9): ref_os, adminStage(), ctx(), fake, h, jsonReq(), moderate(), propose() (+1 more)

### Community 143 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 144 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 145 - "stripe-mode.test.ts"
Cohesion: 0.20
Nodes (7): stripe, refundCampaignPayment(), constructorKeys, envMock, FakeStripe, refundsCreate, sessionsCreate

### Community 146 - "lib/campaign-worker.ts"
Cohesion: 0.18
Nodes (18): AudienceEstimate, estimatedForChannel(), estimateNetworkLocalAudience(), networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete() (+10 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "dashboard/route.ts"
Cohesion: 0.50
Nodes (6): GET(), resolvePeriod(), getFreeMerchantStats(), getHomeStats(), getTotalClients(), hasAnyRecordedRevenue()

### Community 149 - "merchant-billing.test.ts"
Cohesion: 0.25
Nodes (6): mapStripeSubscriptionStatus(), ctxReq(), fake, h, PERIOD_END, preview()

### Community 150 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 151 - "customer-loyalty-overview.ts"
Cohesion: 0.08
Nodes (44): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, CustomerProgramView (+36 more)

### Community 152 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 153 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.13
Nodes (23): src_components_fife_life_sponsored_banner_sponsoredad, SponsoredBanner(), src_components_fife_life_sponsored_banner_sponsoredvariant, isExternalUrl(), SponsoredAd, SponsoredOfferCard(), navigate(), onCardClick() (+15 more)

### Community 155 - "session.ts"
Cohesion: 0.14
Nodes (21): ref_crypto, POST(), POST(), FinalisationPage(), FinalisationForm(), createRawCustomerToken(), CUSTOMER_TOKEN_TTL, invalidateCustomerAccessTokens() (+13 more)

### Community 156 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 157 - "televerser/route.ts"
Cohesion: 0.33
Nodes (5): DELETE(), uploadSchema, POST(), createAd(), merchantStage()

### Community 158 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 160 - "ad-detail.tsx"
Cohesion: 0.08
Nodes (33): AdDetailPage(), confirmBannerCrop(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast() (+25 more)

### Community 161 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 163 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 164 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 165 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.10
Nodes (33): main(), POST(), schema, GET(), approvedGoogleWalletHeroUrl(), AdCandidate, CustomerZone, DeliveryCheck (+25 more)

### Community 167 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 168 - "ad-google-wallet-visual-workflow.ts"
Cohesion: 0.33
Nodes (10): AdWalletCtx, approveWalletVisualAsIs(), clearWalletVisual(), merchantRespondWalletVisual(), nextWalletNumber(), notify(), proposeWalletVisual(), WalletVersionFiles (+2 more)

### Community 169 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 170 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 171 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 172 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (18): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CARD_SCHEMA_VERSION, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+10 more)

### Community 174 - "landing-header.tsx"
Cohesion: 0.32
Nodes (6): MoonIcon(), SunIcon(), isInternalRoute(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 175 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 176 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 177 - "super-admin-ad-detail-page.test.ts"
Cohesion: 0.40
Nodes (4): adRequestFindUnique, getSuperAdminSessionUser, notFound, redirect

### Community 180 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

## Knowledge Gaps
- **1031 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1026 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1383 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@prisma/client` connect `@prisma/client` to `loyalty-context.ts`, `next`, `merchant-card-template-service.ts`, `click/route.ts`, `employee-invitation-service.ts`, `loyalty-commit.ts`, `merchant-billing.ts`, `card-editor.tsx`, `staff-notification-delivery.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `prisma.ts`, `customer-reward-progress.ts`, `audit.ts`, `customer-qr.ts`, `lib/campaign-worker.ts`, `ad-visual-workflow.ts`, `google-wallet.ts`, `jsonError`, `merchant-card-finish.test.ts`, `customer-loyalty-overview.ts`, `google-auth.ts`, `loyalty-service.test.ts`, `jsonOk`, `session.ts`, `ad-visual-parts.tsx`, `employees/[id]/route.ts`, `types.ts`, `ad-detail.tsx`, `package.json`, `campaign-lifecycle.ts`, `CardEditorPage`, `customer-onboarding.ts`, `sponsored-selection.ts`, `ad-google-wallet-visual-workflow.ts`, `loyalty-service.ts`, `wallet-home.tsx`, `qa-login.ts`, `insight-stats.ts`, `sponsored-test-broadcast.ts`, `platform-stats.ts`, `resolvePublishedMerchantCardTemplate`, `merchant-card-renderer.tsx`, `advantages-ui.tsx`, `unsubscribe/route.ts`, `requireMerchantAdmin`, `super-admin-session.ts`, `campaign-quota.ts`, `getSessionUser`, `money.ts`, `preview-data.ts`, `env.ts`, `use-wallet-unlock-animation.ts`, `qr.ts`, `employee-session.ts`, `cashier-checkout.tsx`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `profile-shared.tsx`, `caisse/ui.tsx`, `loyalty-context.ts`, `app/ui.tsx`, `click/route.ts`, `react`, `caisse-scan.ts`, `layout-client.tsx`, `card-editor.tsx`, `super-admin-campaign-moderation.test.ts`, `notifications-center.tsx`, `prisma.ts`, `marketing-topup-route.test.ts`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `jsonError`, `customer-loyalty-overview.ts`, `google-auth.ts`, `hosts.ts`, `jsonOk`, `session.ts`, `customer-qr-route.test.ts`, `merchant-ad-edit.test.ts`, `demo-visual.ts`, `ad-detail.tsx`, `types.ts`, `package.json`, `customer-notifications-route.test.ts`, `customer-preferences-route.test.ts`, `ad-visuals.ts`, `sponsored-selection.ts`, `customer-onboarding.ts`, `api-merchant-statistics-route.test.ts`, `media-storage.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `demo-session.ts`, `src/app/page.tsx`, `landing-footer.tsx`, `landing-header.tsx`, `employe/layout.tsx`, `qa-login.ts`, `wallet-home.tsx`, `carte/avantages/page.tsx`, `super-admin/layout.tsx`, `card-enlarged-view.tsx`, `employee-demo-server.ts`, `card-deck.tsx`, `vitest`, `resolvePublishedMerchantCardTemplate`, `advantages-ui.tsx`, `unsubscribe/route.ts`, `profile-page.tsx`, `super-admin-session.ts`, `getSessionUser`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `cn`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `employee-session.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `loyalty-context.ts`, `next`, `merchant-card-template-service.ts`, `click/route.ts`, `react`, `loyalty-commit.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `customer-reward-progress.ts`, `merchant-card-finish.test.ts`, `google-auth.ts`, `hosts.ts`, `employees/[id]/route.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `insight-period.ts`, `loyalty-service.ts`, `demo-session.ts`, `@prisma/client`, `qa-login.ts`, `ref_node_path`, `stripe.ts`, `email.ts`, `sponsored-slot.test.tsx`, `sponsored-test-broadcast.ts`, `card-enlarged-view.tsx`, `insight-permissions.test.ts`, `platform-stats.ts`, `card-deck.tsx`, `resolvePublishedMerchantCardTemplate`, `stripe-webhook-route.test.ts`, `sponsored-placements.test.ts`, `campaign-en-cours.ts`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `app/app/connexion/page.tsx`, `campaign-quota.ts`, `ad-visual-journeys.test.ts`, `money.ts`, `campaign-test-mode-isolation.test.ts`, `src/app/layout.tsx`, `ad-visual-crop-specs.ts`, `campaign-worker.test.ts`, `cn`, `tarifs/page.tsx`, `campaign-crud-routes.test.ts`, `env.ts`, `ad-confirm-route.test.ts`, `use-wallet-unlock-animation.ts`, `campaign-confirm-route.test.ts`, `qr.ts`, `caisse/ui.tsx`, `employee-invitation-service.ts`, `super-admin-campaign-moderation.test.ts`, `staff-notification-delivery.ts`, `landing-page.test.ts`, `push-client.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `marketing-topup-route.test.ts`, `stripe-mode.test.ts`, `lib/campaign-worker.ts`, `loyalty-service.test.ts`, `dashboard/route.ts`, `merchant-billing.test.ts`, `customer-loyalty-overview.ts`, `customer-qr-route.test.ts`, `merchant-ad-edit.test.ts`, `campaign-quota.test.ts`, `campaign-audience.test.ts`, `customer-notifications-route.test.ts`, `caisse-scan.test.ts`, `campaign-lifecycle.ts`, `customer-preferences-route.test.ts`, `marketing-balance.test.ts`, `sponsored-selection.ts`, `api-merchant-statistics-route.test.ts`, `super-admin-ad-moderation.test.ts`, `customer-push-route.test.ts`, `super-admin-ad-detail-page.test.ts`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1031 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `loyalty-context.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11416490486257928 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.07150153217568948 - nodes in this community are weakly interconnected._